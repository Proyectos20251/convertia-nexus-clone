import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent, 
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Plus, Minus } from "lucide-react";

interface Employee {
  id: string; // Changed from number to string to match the database UUID format
  name: string;
  position: string;
  department: string;
  manager?: string; // Changed from number to string as well
  avatar?: string;
}

interface OrganizationChartProps {
  data: Employee[];
}

const OrganizationChart: React.FC<OrganizationChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!data.length || !svgRef.current || !containerRef.current) return;

    // Clear previous chart
    while (svgRef.current.firstChild) {
      svgRef.current.removeChild(svgRef.current.firstChild);
    }

    // Setup dimensions
    const width = containerRef.current.clientWidth;
    const height = 500;
    svgRef.current.setAttribute("width", width.toString());
    svgRef.current.setAttribute("height", height.toString());
    
    // Find the root node (has no manager)
    const rootNode = data.find(emp => !emp.manager);
    if (!rootNode) return;

    // Create position map to build the tree
    const positionMap = buildPositionMap(data, rootNode.id, width / 2, 80, width);
    
    // Draw connections
    drawConnections(data, positionMap);
    
    // Draw nodes
    data.forEach(employee => {
      const position = positionMap.get(employee.id);
      if (position) {
        drawNode(employee, position.x, position.y);
      }
    });

  }, [data]);

  // Build map of node positions
  const buildPositionMap = (
    employees: Employee[],
    rootId: string, 
    x: number, 
    y: number, 
    availableWidth: number
  ): Map<string, {x: number, y: number}> => {
    const positions = new Map<string, {x: number, y: number}>();
    positions.set(rootId, {x, y});

    const buildChildPositions = (parentId: string, level: number, startX: number, width: number) => {
      const children = employees.filter(emp => emp.manager === parentId);
      
      if (children.length === 0) return;
      
      const verticalGap = 100;
      const childY = y + level * verticalGap;
      const childWidth = width / children.length;
      
      children.forEach((child, index) => {
        const childX = startX + childWidth * index + childWidth / 2;
        positions.set(child.id, {x: childX, y: childY});
        buildChildPositions(child.id, level + 1, startX + index * childWidth, childWidth);
      });
    };
    
    buildChildPositions(rootId, 1, 0, availableWidth);
    return positions;
  };

  // Draw connections between nodes
  const drawConnections = (
    employees: Employee[],
    positions: Map<string, {x: number, y: number}>
  ) => {
    employees.forEach(employee => {
      if (employee.manager) {
        const fromPos = positions.get(employee.manager);
        const toPos = positions.get(employee.id);
        
        if (fromPos && toPos) {
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          
          const midY = (fromPos.y + toPos.y) / 2;
          
          path.setAttribute(
            "d", 
            `M ${fromPos.x} ${fromPos.y + 30} 
             C ${fromPos.x} ${midY}, ${toPos.x} ${midY}, 
             ${toPos.x} ${toPos.y - 30}`
          );
          
          path.setAttribute("stroke", "#ddd");
          path.setAttribute("stroke-width", "2");
          path.setAttribute("fill", "none");
          
          svgRef.current?.appendChild(path);
        }
      }
    });
  };

  // Draw individual node
  const drawNode = (employee: Employee, x: number, y: number) => {
    if (!svgRef.current) return;
    
    // Create a group for the node
    const nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    nodeGroup.setAttribute("transform", `translate(${x - 60}, ${y - 30})`);
    nodeGroup.classList.add("cursor-pointer", "employee-node");
    nodeGroup.setAttribute("data-id", employee.id.toString());

    // Create background rectangle
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "120");
    rect.setAttribute("height", "60");
    rect.setAttribute("rx", "8");
    rect.setAttribute("ry", "8");
    rect.setAttribute("fill", "white");
    rect.setAttribute("stroke", "#e2e8f0");
    rect.setAttribute("stroke-width", "2");
    
    // Employee name
    const name = document.createElementNS("http://www.w3.org/2000/svg", "text");
    name.setAttribute("x", "60");
    name.setAttribute("y", "25");
    name.setAttribute("text-anchor", "middle");
    name.setAttribute("font-size", "12");
    name.setAttribute("font-weight", "600");
    name.textContent = employee.name;
    
    // Employee position
    const position = document.createElementNS("http://www.w3.org/2000/svg", "text");
    position.setAttribute("x", "60");
    position.setAttribute("y", "40");
    position.setAttribute("text-anchor", "middle");
    position.setAttribute("font-size", "10");
    position.setAttribute("fill", "#64748b");
    position.textContent = employee.position;
    
    // Add hover effect
    nodeGroup.addEventListener("mouseenter", () => {
      rect.setAttribute("fill", "#f8fafc");
      rect.setAttribute("stroke", "#94a3b8");
    });
    
    nodeGroup.addEventListener("mouseleave", () => {
      rect.setAttribute("fill", "white");
      rect.setAttribute("stroke", "#e2e8f0");
    });
    
    // Add click event to show tooltip
    nodeGroup.addEventListener("click", (event) => {
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (svgRect) {
        const offsetX = event.clientX - svgRect.left;
        const offsetY = event.clientY - svgRect.top;
        
        // Show detailed employee info
        setSelectedEmployee(employee);
        setTooltipPosition({x: offsetX, y: offsetY});
        setShowTooltip(true);
      }
    });
    
    // Append all elements to the group
    nodeGroup.appendChild(rect);
    nodeGroup.appendChild(name);
    nodeGroup.appendChild(position);
    
    // Append group to SVG
    svgRef.current.appendChild(nodeGroup);
  };

  const handleZoom = (factor: number) => {
    if (!svgRef.current) return;
    
    const currentWidth = parseInt(svgRef.current.getAttribute("width") || "0");
    const currentHeight = parseInt(svgRef.current.getAttribute("height") || "0");
    
    const newWidth = currentWidth * factor;
    const newHeight = currentHeight * factor;
    
    svgRef.current.setAttribute("width", newWidth.toString());
    svgRef.current.setAttribute("height", newHeight.toString());
    
    // Update viewBox to maintain position
    const currentViewBox = svgRef.current.getAttribute("viewBox")?.split(" ").map(Number) || [0, 0, currentWidth, currentHeight];
    
    const viewBoxX = currentViewBox[0];
    const viewBoxY = currentViewBox[1];
    const viewBoxWidth = currentViewBox[2];
    const viewBoxHeight = currentViewBox[3];
    
    const newViewBoxWidth = viewBoxWidth / factor;
    const newViewBoxHeight = viewBoxHeight / factor;
    
    // Adjust viewBox to zoom around the center
    const newViewBoxX = viewBoxX + (viewBoxWidth - newViewBoxWidth) / 2;
    const newViewBoxY = viewBoxY + (viewBoxHeight - newViewBoxHeight) / 2;
    
    svgRef.current.setAttribute(
      "viewBox", 
      `${newViewBoxX} ${newViewBoxY} ${newViewBoxWidth} ${newViewBoxHeight}`
    );
  };

  return (
    <TooltipProvider>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-end gap-2 mb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleZoom(1.2)}
                >
                  <Plus size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Acercar</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleZoom(0.8)}
                >
                  <Minus size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Alejar</TooltipContent>
            </Tooltip>
          </div>
          
          <div 
            ref={containerRef} 
            className="w-full overflow-auto relative"
            style={{ minHeight: "500px" }}
          >
            <svg 
              ref={svgRef}
              className="organigram-svg"
            />
            
            {/* Employee Details Popup */}
            {showTooltip && selectedEmployee && (
              <div 
                className="absolute bg-white p-3 shadow-lg rounded-lg border"
                style={{
                  top: tooltipPosition.y + 10,
                  left: tooltipPosition.x + 10,
                  zIndex: 10
                }}
              >
                <div className="flex justify-between mb-1">
                  <h3 className="font-bold">{selectedEmployee.name}</h3>
                  <button 
                    className="text-gray-500 hover:text-gray-700" 
                    onClick={() => setShowTooltip(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="text-sm">
                  <p><span className="font-medium">Posición:</span> {selectedEmployee.position}</p>
                  <p><span className="font-medium">Departamento:</span> {selectedEmployee.department}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default OrganizationChart;
