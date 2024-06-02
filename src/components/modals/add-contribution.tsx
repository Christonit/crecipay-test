import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export function AddPayment() {
  const contribution_year = [
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
    new Date().getFullYear() + 2,
  ];

  const fetchClientSecret = () => {
    // Create a Checkout Session
    return fetch("/api/checkout_sessions", {
      method: "POST",
    }).then((res: any) => {
      console.log(1, res);
      console.log(2, res.json());
    });
    //   .then((data) => data.clientSecret);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">+ Add Contribution</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Add new contribution</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="contribution">Contribution</Label>
            <Input type="number" id="contribution" placeholder="$000" />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label htmlFor="contribution_year">Contribution year</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a valid contribution year" />
              </SelectTrigger>
              <SelectContent>
                {contribution_year.map((year) => (
                  <SelectItem value={String(year)}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={fetchClientSecret}>Submit contribution</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
