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
  const [done, setDone] = useState(false)

  const preview = useMemo(() => staffSeed.slice(0, 5), [])

  const handleImport = async () => {
    try {
      setImporting(true)
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
          // Optional fields left null by omission
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

      if (toInsert.length === 0) {
        toast({ title: 'Nothing to import', description: 'All records already exist.' })
        setDone(true)
        return
      }

      const { error } = await supabase.from('employees').insert(toInsert)
      if (error) throw error

      toast({ title: 'Import completed', description: `${toInsert.length} employees added successfully.` })
      setDone(true)
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
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm opacity-80">Total records: {staffSeed.length}</p>
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
            <Button variant="outline" disabled={importing || done} onClick={handleImport} aria-label="Import staff list">
              {importing ? 'Importing…' : done ? 'Imported' : 'Import Now'}
            </Button>
          </div>
        </div>
        <Separator className="my-4" />
        <p className="text-xs opacity-70">
          Notes: Employee IDs will be generated as EMP-0001, EMP-0002, … Departments are inferred from the text after the dash in
          the designation when present. You can edit details later in Employee Management.
        </p>
      </CardContent>
    </Card>
  )
}
