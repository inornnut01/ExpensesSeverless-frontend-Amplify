import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TestimonialCardProps {
  name: string;
  role: string;
  comment: string;
  rating: number;
  initials: string;
}

const TestimonialCard = ({
  name,
  role,
  comment,
  rating,
  initials,
}: TestimonialCardProps) => {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-card p-6">
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-blue-600 text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-blue-600 text-blue-600" />
          ))}
        </div>
      </div>
      <p className="text-foreground/90 leading-relaxed">{comment}</p>
    </Card>
  );
};

export default TestimonialCard;
