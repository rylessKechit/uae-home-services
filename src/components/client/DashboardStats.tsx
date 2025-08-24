'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const stats = [
  {
    title: "Total Bookings",
    value: "12",
    description: "+2 from last month",
    icon: Calendar,
    trend: "up",
    color: "text-blue-600"
  },
  {
    title: "Pending Services",
    value: "3",
    description: "2 this week",
    icon: Clock,
    trend: "neutral",
    color: "text-orange-600",
    urgent: true
  },
  {
    title: "Completed",
    value: "9",
    description: "75% success rate",
    icon: CheckCircle,
    trend: "up",
    color: "text-green-600"
  },
  {
    title: "Average Rating",
    value: "4.8",
    description: "Based on 9 reviews",
    icon: Star,
    trend: "up",
    color: "text-yellow-600"
  }
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-md bg-muted ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {stat.value}
                  {stat.urgent && (
                    <Badge variant="secondary" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {stat.trend === "up" && (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  )}
                  {stat.description}
                </div>
              </div>
            </div>
          </CardContent>
          
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
            <div className={`w-full h-full rounded-full ${stat.color} bg-current transform translate-x-8 -translate-y-8`} />
          </div>
        </Card>
      ))}
    </div>
  )
}