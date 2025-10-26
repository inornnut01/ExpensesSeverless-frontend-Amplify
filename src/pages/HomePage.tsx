import Footer from "@/components/Landing/Footer";
import Navbar from "@/components/Landing/Navbar";
import StatCard from "@/components/Landing/StatCard";
import TestimonialCard from "@/components/Landing/TestimonialCard";
import { Wallet, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function HomePage() {
  return (
    <div className="max-w-7xl mx-auto">
      <Navbar />
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-400 px-6 py-20">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Wallet className="h-5 w-5 text-white" />
              <span className="text-white font-medium">
                Smart Expense Tracking
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Take Control of
              <br />
              Your Finances
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Track expenses, manage budgets, and achieve your financial goals
              with ease
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-500 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Expense
            </Button>
          </div>
        </div>
      </div>
      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Total Balance"
            amount="$12,450"
            icon={Wallet}
            trend="+12.5%"
            trendUp={true}
          />
          <StatCard
            title="Income"
            amount="$8,240"
            icon={TrendingUp}
            trend="+8.2%"
            trendUp={true}
          />
          <StatCard
            title="Expenses"
            amount="$3,680"
            icon={TrendingDown}
            trend="-3.1%"
            trendUp={false}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground">
            Join thousands of satisfied users managing their finances better
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            name="Sarah Johnson"
            role="Freelance Designer"
            comment="This app has completely transformed how I manage my freelance income and expenses. The interface is intuitive and the insights are incredibly helpful!"
            rating={5}
            initials="SJ"
          />
          <TestimonialCard
            name="Michael Chen"
            role="Small Business Owner"
            comment="Finally, an expense tracker that's both powerful and easy to use. I can now track all my business expenses in one place and make better financial decisions."
            rating={5}
            initials="MC"
          />
          <TestimonialCard
            name="Emma Williams"
            role="Marketing Manager"
            comment="The budget tracking features are fantastic. I've saved so much money just by being more aware of my spending patterns. Highly recommend!"
            rating={5}
            initials="EW"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
