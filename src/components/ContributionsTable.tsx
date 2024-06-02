"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ContributionI } from "../lib/types";

export default function ContributionsTable({
  contributions,
}: {
  contributions: ContributionI[];
}) {
  return (
    <Table>
      <TableHeader className="w-full">
        <TableCell>Amount</TableCell>
        <TableCell>Submission Date</TableCell>
        <TableCell>Funding Source</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Contribution Year</TableCell>
      </TableHeader>
      <TableBody>
        {contributions.map((contribution, index) => (
          <TableRow key={index}>
            <TableCell className="max-w-[200px]">
              ${contribution.amount}
            </TableCell>
            <TableCell>
              {contribution.submission_date.toLocaleString()}
            </TableCell>
            <TableCell>{contribution.funding_source}</TableCell>
            <TableCell>{contribution.status}</TableCell>
            <TableCell>{contribution.contribution_year}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
