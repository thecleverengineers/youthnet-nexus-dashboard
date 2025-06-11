
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Calendar, Download, ExternalLink } from 'lucide-react';

export function CertificationTracking() {
  const [certifications] = useState([
    {
      id: 1,
      name: 'Web Development Professional',
      issuer: 'YouthNet Academy',
      studentName: 'John Doe',
      progress: 100,
      status: 'completed',
      issueDate: '2024-01-20',
      expiryDate: '2026-01-20',
      credentialId: 'YN-WD-2024-001',
      skills: ['HTML', 'CSS', 'JavaScript', 'React']
    },
    {
      id: 2,
      name: 'Digital Marketing Specialist',
      issuer: 'YouthNet Academy',
      studentName: 'Jane Smith',
      progress: 85,
      status: 'in_progress',
      expectedCompletion: '2024-02-15',
      skills: ['SEO', 'Social Media', 'Google Ads']
    },
    {
      id: 3,
      name: 'Data Analysis Fundamentals',
      issuer: 'YouthNet Academy',
      studentName: 'Mike Johnson',
      progress: 45,
      status: 'in_progress',
      expectedCompletion: '2024-03-01',
      skills: ['Excel', 'Python', 'Statistics']
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certification Tracking
          </div>
          <Button size="sm">
            Issue New Certificate
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {certifications.map((cert) => (
            <div key={cert.id} className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{cert.name}</h3>
                  <p className="text-muted-foreground text-sm mb-1">
                    Student: {cert.studentName}
                  </p>
                  <p className="text-muted-foreground text-sm mb-2">
                    Issuer: {cert.issuer}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge className={getStatusColor(cert.status)}>
                  {cert.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{cert.progress}%</span>
                </div>
                <Progress value={cert.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                {cert.status === 'completed' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Issued: {new Date(cert.issueDate!).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Expires: {new Date(cert.expiryDate!).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ID: </span>
                      {cert.credentialId}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Expected: {new Date(cert.expectedCompletion!).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {cert.status === 'completed' ? (
                  <>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm">
                      View Progress
                    </Button>
                    <Button size="sm">
                      Update Status
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
