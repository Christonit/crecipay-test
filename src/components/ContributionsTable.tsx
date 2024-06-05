"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContributionI } from "../lib/types";
import {
  AiOutlineBank,
  AiOutlineCalendar,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { TbActivityHeartbeat } from "react-icons/tb";
import { MdOutlineAttachMoney } from "react-icons/md";
import { parseDate } from "@/lib/utils";
export default function ContributionsTable({
  contributions,
}: {
  contributions: ContributionI[];
}) {
  return (
    <Table>
      <TableHeader className="w-full">
        <TableCell className="table-header-cell">
          <div className="inline-flex items-center justify-start gap-[4px] w-full ">
            <MdOutlineAttachMoney size={20} /> Amount
          </div>
        </TableCell>
        <TableCell className="table-header-cell">
          <div className="inline-flex items-center justify-center gap-[4px] w-full ">
            <AiOutlineCalendar size={20} />
            Submission Date
          </div>
        </TableCell>
        <TableCell className="table-header-cell">
          <div className="inline-flex items-center  justify-center gap-[4px] w-full ">
            <AiOutlineBank size={20} /> Funding Source
          </div>
        </TableCell>
        <TableCell className="table-header-cell">
          <div className="inline-flex items-center  justify-center gap-[4px] w-full ">
            <TbActivityHeartbeat size={20} /> Status
          </div>
        </TableCell>
        <TableCell className="table-header-cell">
          <div className="inline-flex items-center  justify-center gap-[4px] w-full ">
            <AiOutlineClockCircle size={20} /> Contribution Year
          </div>
        </TableCell>
      </TableHeader>
      <TableBody>
        {contributions.map((contribution, index) => (
          <TableRow key={index}>
            <TableCell className="table-cell !text-left">
              ${Math.round(Number(contribution.amount / 100))}
            </TableCell>
            <TableCell className="table-cell">
              {parseDate(contribution.submission_date.toLocaleString())}
            </TableCell>
            <TableCell className="table-cell">
              via
              <span className="uppercase ml-[4px]">
                {contribution.funding_source}
              </span>
            </TableCell>
            <TableCell className="table-cell">{contribution.status}</TableCell>
            <TableCell className="table-cell">
              {contribution.contribution_year}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
