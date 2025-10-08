import React, { useState, useEffect, useRef } from 'react';
import { TimeEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TimeTrackerProps {
  issueId: string;
  onTimeLogged: (entry: Omit<TimeEntry, 'id'>) => void;
  currentUserId: string;
}

export function TimeTracker({ issueId, onTimeLogged, currentUserId }: TimeTrackerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // w sekundach
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      startTimeRef.current = new Date();
      interval = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          // Automatyczne przełączanie między pracą a przerwą
          if (mode === 'work' && newTime >= 25 * 60) {
            // Zaloguj sesję pracy przed zmianą
            if (startTimeRef.current) {
              onTimeLogged({
                issueId,
                userId: currentUserId,
                startTime: startTimeRef.current,
                endTime: new Date(),
                duration: 25,
                type: 'pomodoro',
                description: 'Work session'
              });
            }
            setMode('break');
            startTimeRef.current = new Date();
            return 0;
          } else if (mode === 'break' && newTime >= 5 * 60) {
            // Zaloguj sesję przerwy
            if (startTimeRef.current) {
              onTimeLogged({
                issueId,
                userId: currentUserId,
                startTime: startTimeRef.current,
                endTime: new Date(),
                duration: 5,
                type: 'pomodoro',
                description: 'Break session'
              });
            }
            setMode('work');
            startTimeRef.current = new Date();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, mode, issueId, currentUserId, onTimeLogged]);

  const handleStart = () => setIsRunning(true);

  const handleStop = () => {
    setIsRunning(false);
    if (time > 0 && startTimeRef.current) {
      onTimeLogged({
        issueId,
        userId: currentUserId,
        startTime: startTimeRef.current,
        endTime: new Date(),
        duration: time / 60,
        type: 'pomodoro',
        description: `${mode === 'work' ? 'Work' : 'Break'} session`
      });
    }
    setTime(0);
    setMode('work');
    startTimeRef.current = null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-4">
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-2xl font-mono">{formatTime(time)}</div>
            <div className="text-sm text-muted-foreground capitalize">{mode}</div>
          </div>
          <div className="space-x-2">
            <Button onClick={handleStart} disabled={isRunning}>Start</Button>
            <Button onClick={handleStop} variant="outline" disabled={!isRunning}>Stop</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
