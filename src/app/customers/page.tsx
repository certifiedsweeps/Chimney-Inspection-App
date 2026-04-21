import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, ClipboardList } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { lastName: "asc" },
    include: {
      _count: { select: { inspections: true } },
      inspections: { orderBy: { inspectionDate: "desc" }, take: 1 },
    },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <Link
          href="/inspections/new"
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          New Inspection
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {customers.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No customers yet</p>
            <p className="text-sm mt-1">Customers are created when you start a new inspection.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 px-6 py-3 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Contact</div>
              <div className="col-span-3">Address</div>
              <div className="col-span-2">Inspections</div>
              <div className="col-span-1">Last</div>
            </div>
            <div className="divide-y divide-gray-50">
              {customers.map((c) => (
                <div key={c.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-amber-50/30 transition-colors">
                  <div className="col-span-3 font-medium text-sm text-gray-900">
                    {c.firstName} {c.lastName}
                  </div>
                  <div className="col-span-3 text-sm text-gray-500">
                    <div>{c.phone}</div>
                    <div className="text-xs">{c.email}</div>
                  </div>
                  <div className="col-span-3 text-sm text-gray-500 text-xs">
                    {[c.address, c.city, c.state].filter(Boolean).join(", ")}
                  </div>
                  <div className="col-span-2">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                      <ClipboardList className="w-3.5 h-3.5" />
                      {c._count.inspections}
                    </span>
                  </div>
                  <div className="col-span-1 text-xs text-gray-400">
                    {c.inspections[0] ? formatDate(c.inspections[0].inspectionDate) : "—"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
