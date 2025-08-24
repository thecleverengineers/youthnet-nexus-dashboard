import React, { useMemo, useState } from 'react'
import { staffSeed } from '@/data/staffSeed'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'

// Helper to parse various date formats like dd/mm/yyyy or dd-mm-yyyy into YYYY-MM-DD
function parseToISODate(input?: string): string | null {
  if (!input) return null
  const str = input.trim()
  // Replace various separators with '-'
  const norm = str.replace(/[\.\/]/g, '-').replace(/\s+/g, '')
  // Expecting d-m-yyyy
  const match = norm.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)
  if (!match) return null
  const d = parseInt(match[1], 10)
  const m = parseInt(match[2], 10)
  const y = parseInt(match[3], 10)
  if (m < 1 || m > 12 || d < 1 || d > 31) return null
  const mm = String(m).padStart(2, '0')
  const dd = String(d).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

function splitDesignation(designation: string): { position: string; department: string } {
  // Split on hyphen or en dash
  const parts = designation.split(/\s[-–]\s/)
  const position = parts[0]?.trim() || 'Staff'
  let department = parts[1]?.trim()
  if (!department || department.length === 0) {
    // Fallback: use position as department to satisfy NOT NULL
    department = position
  }
  return { position, department }
}

export const QuickStaffImport: React.FC = () => {
  const { toast } = useToast()
  const [importing, setImporting] = useState(false)
  const [importStats, setImportStats] = useState<{
    totalInDb: number
    toImport: number
    alreadyExists: number
    imported: number
  } | null>(null)

  const preview = useMemo(() => staffSeed.slice(0, 5), [])

  // Fetch current database count
  const fetchStats = async () => {
    const { count } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
    return count || 0
  }

  const handleImport = async () => {
    try {
      setImporting(true)
      const initialCount = await fetchStats()
      
      // Map to employees table shape
      const rows = staffSeed.map((item) => {
        const { position, department } = splitDesignation(item.designation)
        return {
          employee_id: `EMP-${String(item.sNo).padStart(4, '0')}`,
          position,
          department,
          employment_status: 'active',
          employment_type: 'full_time',
          hire_date: parseToISODate(item.dateOfJoining || undefined),
        }
      })

      const ids = rows.map((r) => r.employee_id)
      const { data: existing, error: existingError } = await supabase
        .from('employees')
        .select('employee_id')
        .in('employee_id', ids)
      if (existingError) throw existingError

      const existingSet = new Set((existing || []).map((e: any) => e.employee_id))
      const toInsert = rows.filter((r) => !existingSet.has(r.employee_id))
      const alreadyExists = rows.length - toInsert.length

      if (toInsert.length === 0) {
        const finalCount = await fetchStats()
        setImportStats({
          totalInDb: finalCount,
          toImport: staffSeed.length,
          alreadyExists: alreadyExists,
          imported: 0
        })
        toast({ title: 'Nothing to import', description: 'All records already exist in database.' })
        return
      }

      const { error } = await supabase.from('employees').insert(toInsert)
      if (error) throw error

      const finalCount = await fetchStats()
      setImportStats({
        totalInDb: finalCount,
        toImport: staffSeed.length,
        alreadyExists: alreadyExists,
        imported: toInsert.length
      })
      
      toast({ 
        title: 'Import completed', 
        description: `${toInsert.length} employees added. Total in database: ${finalCount}` 
      })
    } catch (e: any) {
      console.error(e)
      toast({ title: 'Import failed', description: e.message || 'Something went wrong', variant: 'destructive' as any })
    } finally {
      setImporting(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Quick Import: Provided Staff List</CardTitle>
        <CardDescription>One-click import into Employees with generated IDs and inferred departments.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm opacity-80">Records to import: {staffSeed.length}</p>
              <p className="text-sm opacity-80">Preview:</p>
              <ul className="text-sm list-disc pl-5">
                {preview.map((p) => (
                  <li key={p.sNo}>
                    {p.name} — {p.designation} ({p.dateOfJoining || 'No Date'})
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" disabled={importing} onClick={handleImport} aria-label="Import staff list">
                {importing ? 'Importing…' : 'Import Now'}
              </Button>
            </div>
          </div>
          
          {importStats && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm">Import Results (Live from Database)</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total in Database:</span>
                  <span className="font-mono font-semibold text-primary">{importStats.totalInDb}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Newly Imported:</span>
                  <span className="font-mono text-green-600">{importStats.imported}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Already Existed:</span>
                  <span className="font-mono text-yellow-600">{importStats.alreadyExists}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Processed:</span>
                  <span className="font-mono">{importStats.toImport}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        <p className="text-xs opacity-70">
          Employee IDs: EMP-0001, EMP-0002, ... Departments are inferred from designation text.
          Data is fetched directly from the database to show real-time results.
        </p>
      </CardContent>
    </Card>
  )
}
