"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, X, Play, AlertTriangle, CheckCircle2 } from "lucide-react"
import type { AutomationRule, AutomationCategory, AutomationTriggerType, AutomationConditionOperator, AutomationActionType } from "@/types"

interface AutomationRuleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (rule: Partial<AutomationRule>) => void
  templates?: any[]
}

interface FormData {
  name: string
  description: string
  category: AutomationCategory
  trigger: {
    type: AutomationTriggerType
    config: Record<string, any>
  }
  conditions: Array<{
    field: string
    operator: AutomationConditionOperator
    value: any
  }>
  actions: Array<{
    type: AutomationActionType
    config: Record<string, any>
  }>
  startAsDraft: boolean
}

const STEPS = [
  { id: 'basic', title: 'Basic Info', icon: '📝' },
  { id: 'trigger', title: 'Trigger', icon: '⚡' },
  { id: 'conditions', title: 'Conditions', icon: '🎯' },
  { id: 'actions', title: 'Actions', icon: '🚀' },
  { id: 'review', title: 'Review & Test', icon: '✅' }
]

const TRIGGER_TYPES: Array<{ value: AutomationTriggerType; label: string; description: string }> = [
  { value: 'status_change', label: 'Status Changed', description: 'When task status changes' },
  { value: 'pr_merged', label: 'PR Merged', description: 'When PR is merged in GitLab/GitHub' },
  { value: 'time_based', label: 'Time-based', description: 'On schedule (daily, weekly, etc.)' },
  { value: 'assignee_change', label: 'Assignee Changed', description: 'When task is assigned to someone' },
  { value: 'sprint_start', label: 'Sprint Started', description: 'When sprint begins' },
  { value: 'sprint_end', label: 'Sprint Ended', description: 'When sprint ends' },
  { value: 'comment_added', label: 'Comment Added', description: 'When someone adds a comment' },
  { value: 'manual', label: 'Manual Trigger', description: 'Run manually or via API' }
]

const CATEGORIES: Array<{ value: AutomationCategory; label: string; icon: string }> = [
  { value: 'sync', label: 'Sync', icon: '🔄' },
  { value: 'assignment', label: 'Assignment', icon: '👤' },
  { value: 'notification', label: 'Notification', icon: '🔔' },
  { value: 'sprint', label: 'Sprint', icon: '🏃' },
  { value: 'recurring', label: 'Recurring', icon: '🔁' },
  { value: 'custom', label: 'Custom', icon: '⚙️' }
]

const CONDITION_FIELDS = [
  { value: 'status', label: 'Status' },
  { value: 'assignee', label: 'Assignee' },
  { value: 'priority', label: 'Priority' },
  { value: 'sprintId', label: 'Sprint' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' }
]

const CONDITION_OPERATORS: Array<{ value: AutomationConditionOperator; label: string }> = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'not equals' },
  { value: 'contains', label: 'contains' },
  { value: 'greater_than', label: 'greater than' },
  { value: 'less_than', label: 'less than' },
  { value: 'in_sprint', label: 'in sprint' },
  { value: 'has_tag', label: 'has tag' }
]

const ACTION_TYPES: Array<{ value: AutomationActionType; label: string; description: string }> = [
  { value: 'move_status', label: 'Move Status', description: 'Change task status' },
  { value: 'assign_user', label: 'Assign User', description: 'Assign task to someone' },
  { value: 'send_notification', label: 'Send Notification', description: 'Send Slack/email notification' },
  { value: 'move_to_sprint', label: 'Move to Sprint', description: 'Add task to sprint' },
  { value: 'add_comment', label: 'Add Comment', description: 'Add automatic comment' },
  { value: 'update_field', label: 'Update Field', description: 'Update any task field' },
  { value: 'create_task', label: 'Create Task', description: 'Create new task' }
]

export function AutomationRuleModal({ open, onOpenChange, onSubmit, templates }: AutomationRuleModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: 'custom',
    trigger: {
      type: 'status_change',
      config: {}
    },
    conditions: [],
    actions: [],
    startAsDraft: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 0: // Basic Info
        if (!formData.name.trim()) {
          newErrors.name = 'Rule name is required'
        }
        if (!formData.description.trim()) {
          newErrors.description = 'Description is required'
        }
        break
      case 1: // Trigger
        if (!formData.trigger.type) {
          newErrors.trigger = 'Trigger type is required'
        }
        break
      case 2: // Conditions (optional)
        break
      case 3: // Actions
        if (formData.actions.length === 0) {
          newErrors.actions = 'At least one action is required'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
    }
  }

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      const newRule: Partial<AutomationRule> = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        trigger: formData.trigger,
        conditions: formData.conditions,
        actions: formData.actions,
        status: formData.startAsDraft ? 'draft' : 'active',
        successRate: 0,
        executionCount: 0,
        failureCount: 0,
        avgExecutionTime: 0,
        createdBy: 'Current User',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      onSubmit(newRule)
      onOpenChange(false)
      
      // Reset form
      setCurrentStep(0)
      setFormData({
        name: '',
        description: '',
        category: 'custom',
        trigger: { type: 'status_change', config: {} },
        conditions: [],
        actions: [],
        startAsDraft: true
      })
    }
  }

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, { field: 'status', operator: 'equals', value: '' }]
    }))
  }

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }))
  }

  const updateCondition = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => 
        i === index ? { ...condition, [field]: value } : condition
      )
    }))
  }

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, { type: 'move_status', config: {} }]
    }))
  }

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }))
  }

  const updateAction = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { ...action, [field]: value } : action
      )
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep formData={formData} setFormData={setFormData} errors={errors} />
      case 1:
        return <TriggerStep formData={formData} setFormData={setFormData} errors={errors} />
      case 2:
        return <ConditionsStep 
          formData={formData} 
          addCondition={addCondition}
          removeCondition={removeCondition}
          updateCondition={updateCondition}
        />
      case 3:
        return <ActionsStep 
          formData={formData} 
          addAction={addAction}
          removeAction={removeAction}
          updateAction={updateAction}
          errors={errors}
        />
      case 4:
        return <ReviewStep formData={formData} />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🤖 Create New Automation Rule
          </DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                index <= currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className={`ml-2 text-sm ${
                index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.icon} {step.title}
              </span>
              {index < STEPS.length - 1 && (
                <div className={`w-8 h-px mx-4 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
              <Button onClick={handleSubmit}>
                Create Rule
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next: {STEPS[currentStep + 1]?.title}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Step Components
function BasicInfoStep({ formData, setFormData, errors }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">📝 Basic Information</h3>
        <p className="text-sm text-muted-foreground">
          Give your automation rule a name and description
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Rule Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., GitLab → Jira Status Sync"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what this automation does..."
            rows={3}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value: AutomationCategory) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="startAsDraft"
              checked={formData.startAsDraft}
              onCheckedChange={(checked) => setFormData({ ...formData, startAsDraft: !!checked })}
            />
            <Label htmlFor="startAsDraft">Start as Draft (recommended)</Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Draft rules won't execute until you activate them
          </p>
        </div>
      </div>
    </div>
  )
}

function TriggerStep({ formData, setFormData, errors }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">⚡ When should this rule run?</h3>
        <p className="text-sm text-muted-foreground">
          Choose what event will trigger your automation
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Trigger Type *</Label>
          <div className="grid gap-2">
            {TRIGGER_TYPES.map(trigger => (
              <Card 
                key={trigger.value}
                className={`cursor-pointer transition-colors ${
                  formData.trigger.type === trigger.value 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setFormData({ 
                  ...formData, 
                  trigger: { ...formData.trigger, type: trigger.value }
                })}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.trigger.type === trigger.value 
                        ? 'border-primary bg-primary' 
                        : 'border-muted-foreground'
                    }`}>
                      {formData.trigger.type === trigger.value && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{trigger.label}</p>
                      <p className="text-sm text-muted-foreground">{trigger.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {errors.trigger && <p className="text-sm text-red-500">{errors.trigger}</p>}
        </div>

        {/* Trigger-specific configuration */}
        {formData.trigger.type === 'status_change' && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium">Status Change Configuration</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any status</SelectItem>
                    <SelectItem value="Todo">Todo</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any status</SelectItem>
                    <SelectItem value="Todo">Todo</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ConditionsStep({ formData, addCondition, removeCondition, updateCondition }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">🎯 Add Conditions (Optional)</h3>
        <p className="text-sm text-muted-foreground">
          Add conditions to limit when this rule runs. Leave empty to run always.
        </p>
      </div>

      <div className="space-y-4">
        {formData.conditions.map((condition: any, index: number) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <Select 
                    value={condition.field} 
                    onValueChange={(value) => updateCondition(index, 'field', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_FIELDS.map(field => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={condition.operator} 
                    onValueChange={(value) => updateCondition(index, 'operator', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_OPERATORS.map(op => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    value={condition.value}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                    placeholder="Value"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeCondition(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" onClick={addCondition} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>

        {formData.conditions.length > 1 && (
          <div className="space-y-2">
            <Label>Logic</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input type="radio" name="logic" value="all" defaultChecked />
                <Label>ALL conditions must be true</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" name="logic" value="any" />
                <Label>ANY condition can be true</Label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ActionsStep({ formData, addAction, removeAction, updateAction, errors }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">🚀 What should happen?</h3>
        <p className="text-sm text-muted-foreground">
          Define the actions to perform when this rule runs
        </p>
      </div>

      <div className="space-y-4">
        {formData.actions.map((action: any, index: number) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Action {index + 1}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeAction(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Action Type</Label>
                <Select 
                  value={action.type} 
                  onValueChange={(value) => updateAction(index, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTION_TYPES.map(actionType => (
                      <SelectItem key={actionType.value} value={actionType.value}>
                        {actionType.label} - {actionType.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action-specific configuration */}
              {action.type === 'move_status' && (
                <div className="space-y-2">
                  <Label>New Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todo">Todo</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="In Review">In Review</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {action.type === 'assign_user' && (
                <div className="space-y-2">
                  <Label>Assignment Strategy</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="by_skills">By Skills</SelectItem>
                      <SelectItem value="by_availability">By Availability</SelectItem>
                      <SelectItem value="round_robin">Round Robin</SelectItem>
                      <SelectItem value="team_lead">Team Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {action.type === 'add_comment' && (
                <div className="space-y-2">
                  <Label>Comment Text</Label>
                  <Textarea
                    placeholder="Enter comment text..."
                    rows={2}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" onClick={addAction} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Action
        </Button>

        {errors.actions && <p className="text-sm text-red-500">{errors.actions}</p>}
      </div>
    </div>
  )
}

function ReviewStep({ formData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">✅ Review & Test</h3>
        <p className="text-sm text-muted-foreground">
          Review your automation rule before creating it
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 {formData.name}
            <Badge variant="outline">{CATEGORIES.find(c => c.value === formData.category)?.icon} {formData.category}</Badge>
          </CardTitle>
          <CardDescription>{formData.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">WHEN:</h4>
            <p className="text-sm text-muted-foreground">
              {TRIGGER_TYPES.find(t => t.value === formData.trigger.type)?.label}
            </p>
          </div>

          {formData.conditions.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">IF:</h4>
              <div className="space-y-1">
                {formData.conditions.map((condition: any, index: number) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    {CONDITION_FIELDS.find(f => f.value === condition.field)?.label} {condition.operator} {condition.value}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">THEN:</h4>
            <div className="space-y-1">
              {formData.actions.map((action: any, index: number) => (
                <p key={index} className="text-sm text-muted-foreground">
                  {index + 1}. {ACTION_TYPES.find(a => a.value === action.type)?.label}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-blue-600" />
        <p className="text-sm text-blue-800 dark:text-blue-200">
          This will create a {formData.startAsDraft ? 'DRAFT' : 'ACTIVE'} rule. 
          {formData.startAsDraft ? ' You can activate it later from the Rules tab.' : ' It will start running immediately.'}
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Play className="h-4 w-4 mr-2" />
          Test Rule (Coming Soon)
        </Button>
      </div>
    </div>
  )
}
