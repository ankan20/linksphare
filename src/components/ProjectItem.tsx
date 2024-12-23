import React from "react";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  name: string;
  description: string;
}

interface Props {
  project: Project;
  markAsDone: (id: string) => void;
}

const ProjectItem: React.FC<Props> = ({ project, markAsDone }) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/project/${project.id}`);
  };

  return (
    <div
      className="flex items-start justify-between p-4 mb-4 bg-gray-800 border-2 border-white rounded-md cursor-pointer hover:bg-gray-700 transition duration-200"
      onClick={handleRedirect}
    >
      {/* Left Side: Styled Label & Description */}
      <div className="flex-1 pr-4">
        <div className="text-sm font-semibold text-gray-100 mb-1">
          <span className="text-blue-400">Project |</span> {project.name}
        </div>
        <p className="text-sm text-gray-400">{project.description}</p>
      </div>

      {/* Right Side: Button */}
      <div
        className="flex items-center justify-center bg-green-500 hover:bg-green-700 text-white px-3 py-2 rounded-md transition duration-200"
        onClick={(e) => {
          e.stopPropagation();
          markAsDone(project.id);
        }}
      >
        Mark Done
      </div>
    </div>
  );
};

export default ProjectItem;
