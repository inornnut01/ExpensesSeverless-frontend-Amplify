import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TransactionFilters = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          // value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select>
        {" "}
        {/* value={typeFilter} onValueChange={setTypeFilter} */}
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="expense">Expense</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        {" "}
        {/* value={categoryFilter} onValueChange={setCategoryFilter} */}
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all">All Categories</SelectItem>
          {/* {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))} */}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TransactionFilters;
