
import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full bg-brand-secondary rounded-full h-2.5">
      <div
        className="bg-brand-accent h-2.5 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const timeRemaining = project.deadline.getTime() - new Date().getTime();
    const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));

    return (
        <div className="mt-2 p-4 bg-brand-surface/50 rounded-lg border border-brand-secondary/50 text-sm">
            <h3 className="font-bold text-brand-accent text-base">{project.name} ({project.id})</h3>
            <p className="text-brand-text-secondary mt-1">{project.description}</p>
            <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-brand-text">Funding Progress</span>
                    <span className="font-mono text-brand-accent">{project.currentFunding.toFixed(2)} / {project.fundingGoal} ETH</span>
                </div>
                <ProgressBar value={project.currentFunding} max={project.fundingGoal} />
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-xs text-brand-text-secondary">Contributors</div>
                        <div className="font-bold text-lg">{project.contributors.length}</div>
                    </div>
                    <div>
                        <div className="text-xs text-brand-text-secondary">Time Left</div>
                        <div className="font-bold text-lg">{daysRemaining} days</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
