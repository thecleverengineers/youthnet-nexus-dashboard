import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Video, 
  MapPin, 
  Users, 
  Bell,
  Repeat,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  type: 'meeting' | 'training' | 'deadline' | 'event' | 'holiday';
  location?: string;
  attendees?: string[];
  isRecurring?: boolean;
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'confirmed' | 'cancelled';
  meetingUrl?: string;
}

interface SmartCalendarProps {
  onEventCreate?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
}

export const SmartCalendar = ({
  onEventCreate,
  onEventUpdate,
  onEventDelete
}: SmartCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
    type: 'meeting' as const,
    location: '',
    attendees: [] as string[],
    priority: 'medium' as const,
    isRecurring: false
  });

  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Standup',
      description: 'Daily team synchronization meeting',
      start: new Date(2024, 0, 25, 9, 0),
      end: new Date(2024, 0, 25, 9, 30),
      type: 'meeting',
      location: 'Conference Room A',
      attendees: ['john@company.com', 'jane@company.com'],
      isRecurring: true,
      priority: 'medium',
      status: 'confirmed',
      meetingUrl: 'https://zoom.us/j/123456789'
    },
    {
      id: '2',
      title: 'Project Deadline',
      description: 'Q1 Report submission deadline',
      start: new Date(2024, 0, 30, 17, 0),
      end: new Date(2024, 0, 30, 17, 0),
      type: 'deadline',
      priority: 'high',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Skills Training Workshop',
      description: 'Advanced JavaScript training session',
      start: new Date(2024, 0, 28, 14, 0),
      end: new Date(2024, 0, 28, 17, 0),
      type: 'training',
      location: 'Training Center',
      attendees: ['developers@company.com'],
      priority: 'medium',
      status: 'confirmed'
    }
  ]);

  const getEventColor = (type: string, priority: string) => {
    const baseColors = {
      meeting: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      training: 'bg-green-500/20 text-green-400 border-green-500/30',
      deadline: 'bg-red-500/20 text-red-400 border-red-500/30',
      event: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      holiday: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };

    if (priority === 'high') {
      return 'bg-red-500/30 text-red-300 border-red-500/50';
    }

    return baseColors[type as keyof typeof baseColors] || baseColors.event;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="h-3 w-3" />;
      case 'training':
        return <Users className="h-3 w-3" />;
      case 'deadline':
        return <Clock className="h-3 w-3" />;
      case 'event':
        return <CalendarIcon className="h-3 w-3" />;
      default:
        return <CalendarIcon className="h-3 w-3" />;
    }
  };

  const createEvent = () => {
    const event: CalendarEvent = {
      id: Date.now().toString(),
      ...newEvent,
      status: 'scheduled'
    };

    onEventCreate?.(event);
    setShowCreateDialog(false);
    
    // Reset form
    setNewEvent({
      title: '',
      description: '',
      start: new Date(),
      end: new Date(),
      type: 'meeting',
      location: '',
      attendees: [],
      priority: 'medium',
      isRecurring: false
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => 
      format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const upcomingEvents = filteredEvents
    .filter(event => event.start >= new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient">Smart Calendar</h2>
          <p className="text-muted-foreground">Intelligent scheduling and event management</p>
        </div>
        <div className="flex gap-3">
          <div className="flex border border-white/20 rounded-lg">
            <Button 
              variant={viewMode === 'month' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button 
              variant={viewMode === 'week' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
            <Button 
              variant={viewMode === 'day' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="professional-button">
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Event title..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Event description..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start Time</label>
                    <Input
                      type="datetime-local"
                      value={format(newEvent.start, "yyyy-MM-dd'T'HH:mm")}
                      onChange={(e) => setNewEvent({...newEvent, start: new Date(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">End Time</label>
                    <Input
                      type="datetime-local"
                      value={format(newEvent.end, "yyyy-MM-dd'T'HH:mm")}
                      onChange={(e) => setNewEvent({...newEvent, end: new Date(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type</label>
                    <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent({...newEvent, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="holiday">Holiday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <Select value={newEvent.priority} onValueChange={(value: any) => setNewEvent({...newEvent, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder="Event location..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createEvent}>
                    Create Event
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedDate && format(selectedDate, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex items-center gap-4">
                  {/* Search and Filter */}
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search events..."
                        className="pl-10 w-48"
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="meeting">Meetings</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="deadline">Deadlines</SelectItem>
                        <SelectItem value="event">Events</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border border-white/10"
                components={{
                  Day: ({ date, ...props }) => {
                    const dayEvents = getEventsForDate(date);
                    return (
                      <div {...props} className="relative">
                        <div>{format(date, 'd')}</div>
                        {dayEvents.length > 0 && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {dayEvents.slice(0, 3).map((event, index) => (
                              <div
                                key={index}
                                className={`w-1 h-1 rounded-full ${
                                  event.priority === 'high' ? 'bg-red-400' :
                                  event.priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                                }`}
                              />
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="w-1 h-1 rounded-full bg-gray-400" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
                }}
              />
              
              {/* Events for Selected Date */}
              {selectedDate && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">
                    Events for {format(selectedDate, 'MMMM d, yyyy')}
                  </h4>
                  <div className="space-y-2">
                    {getEventsForDate(selectedDate).map((event) => (
                      <div
                        key={event.id}
                        className={`p-3 border rounded-lg ${getEventColor(event.type, event.priority)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getEventIcon(event.type)}
                              <span className="font-medium">{event.title}</span>
                              <Badge variant="outline" className="text-xs">
                                {event.type}
                              </Badge>
                              {event.priority === 'high' && (
                                <Badge className="bg-red-500/20 text-red-300 text-xs">
                                  High Priority
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm opacity-90">
                              {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1 text-sm opacity-75 mt-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            )}
                            {event.meetingUrl && (
                              <div className="flex items-center gap-1 text-sm opacity-75 mt-1">
                                <Video className="h-3 w-3" />
                                Video meeting
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {getEventsForDate(selectedDate).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        No events scheduled for this date
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {getEventIcon(event.type)}
                      <span className="font-medium text-sm">{event.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(event.start, 'MMM d, h:mm a')}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-2 w-2" />
                        {event.location}
                      </div>
                    )}
                  </div>
                ))}
                {upcomingEvents.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No upcoming events
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Video className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button className="w-full" variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Set Reminder
              </Button>
              <Button className="w-full" variant="outline">
                <Repeat className="h-4 w-4 mr-2" />
                Create Recurring
              </Button>
              <Button className="w-full" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Invite Attendees
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};