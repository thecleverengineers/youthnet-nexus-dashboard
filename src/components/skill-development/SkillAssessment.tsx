import React from 'react';
import { SkillAssessmentManagement } from './SkillAssessmentManagement';

interface SkillAssessmentProps {
  detailed?: boolean;
}

export function SkillAssessment({ detailed = false }: SkillAssessmentProps) {
  // Delegate to the new management component
  return <SkillAssessmentManagement detailed={detailed} />;
}