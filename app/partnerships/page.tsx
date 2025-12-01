import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PartnershipsPage() {
  return (
    <div className="container py-24 max-w-2xl">
      <h1 className="text-4xl font-bold text-blue-950 mb-4">Partner With Us</h1>
      <p className="text-slate-600 mb-12">
        Join forces with CKSI to create sustainable change. We work with
        corporate partners, local businesses, and international organizations.
      </p>

      <form className="space-y-6 border p-8 rounded-2xl bg-slate-50">
        <div className="grid gap-2">
          <label className="font-medium">Organization Name</label>
          <Input placeholder="Company Ltd." />
        </div>
        <div className="grid gap-2">
          <label className="font-medium">Email</label>
          <Input type="email" placeholder="contact@company.com" />
        </div>
        <div className="grid gap-2">
          <label className="font-medium">Partnership Interest</label>
          <Textarea placeholder="Tell us how you'd like to collaborate..." />
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Send Proposal
        </Button>
      </form>
    </div>
  );
}
