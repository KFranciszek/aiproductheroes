import { TaskTemplate } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TemplateSelectorProps {
  templates: TaskTemplate[];
  onSelect: (template: TaskTemplate) => void;
}

export function TemplateSelector({ templates, onSelect }: TemplateSelectorProps) {
  return (
    <Select onValueChange={(value) => {
      const template = templates.find(t => t.id === value);
      if (template) onSelect(template);
    }}>
      <SelectTrigger>
        <SelectValue placeholder="Select a template" />
      </SelectTrigger>
      <SelectContent>
        {templates.map(template => (
          <SelectItem key={template.id} value={template.id}>
            {template.name} ({template.category})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
