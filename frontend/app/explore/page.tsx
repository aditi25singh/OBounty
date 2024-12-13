'use client'

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Divider } from "@nextui-org/divider";
import { Pagination } from "@nextui-org/pagination"
import { Select, SelectItem } from "@nextui-org/select";
import { Table, TableBody, TableHeader, TableRow, TableColumn, TableCell, Selection } from "@nextui-org/table";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/modal";
import { RadioGroup, Radio } from "@nextui-org/radio";
import React, { ReactElement } from "react";
import { Key, PressEvent } from "@react-types/shared";
import { intlFormatDistance } from "date-fns"
import {Link} from "@nextui-org/link"

export default function ExplorePage() {

  const getIssues = async () => {
    try {
      let res = await fetch("/api/v1/getissues", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "GET",
      })

      console.log(res);

      if (res.ok) {
        let message = await res.json();
        return message["message"]
      } else {
        let error = await res.json();
        console.log(error);
      }
      
    } catch (err) {

    }
  }

  let sissues = [
    {
      id: 0,
      title: "0 Hello world issue",
      description: "Description",
      creator: "lu-zero",
      created: "1 year ago",
      updated: "4 months ago",
      reward: 80,
    },
  ];

  const [issues, setIssue] = React.useState(sissues);

  React.useEffect(() => {
    getIssues().then(x => {

      for (let i = 0; i < x.length; i++) {
        let now = Date.now()

        x[i].created = intlFormatDistance(Date.parse(x[i].created), now)
        x[i].updated = intlFormatDistance(Date.parse(x[i].updated), now)
      }

      setIssue(x)
    })
    
  }, [])

  type Issue = typeof issues[0];

  const [url, setURL] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  const [type, setType] = React.useState("");

  const [filterValue, setFilterValue] = React.useState("");
  const [sortValue, setSortValue] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(2);
  const hasSearchFilter = Boolean(filterValue);
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");

  const pages = Math.ceil(issues.length / rowsPerPage);

  const filteredItems = React.useMemo(() => {
    let filteredIssues = [...issues];

    if (hasSearchFilter) {
      filteredIssues = filteredIssues.filter((issue) =>
        issue.title.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredIssues;
  }, [issues, filterValue]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: Issue, b: Issue) => {
      const first = a['reward'] as number;
      const second = b['reward'] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortValue === "dprice" ? -cmp : cmp;
    });
  }, [sortValue, filteredItems]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const onSortChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortValue(e.target.value);
  }, [])

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const submitIssue = async (e: PressEvent) => {
    try {
      let res = await fetch("/api/v1/postissue", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "url": url,
          "amount" : amount,
          "type" : type
        })
      })

      console.log(res);

      if (res.ok) {
        let message = await res.json();
        alert("Successful!");
      } else {
        let error = await res.json();
        console.log(error);
      }
      
    } catch (err) {

    }
  }

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames = {{
              base : "max-w-[60%]",
            }}
            placeholder="Search by name..."
            value={filterValue}
            size = "lg"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <Select
            label = "Sort By:"
            size = "sm"
            classNames = {{
              base : "max-w-[30%]"
            }}
            variant = "flat"
            onChange={onSortChange}
          >
            <SelectItem key="dprice">
              Price (Higher to Lower)
            </SelectItem>
            <SelectItem key="aprice">
              Price (Lower to Higher)
            </SelectItem>
            <SelectItem key="date">
              Date
            </SelectItem>
          </Select>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange] )

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          loop
          key="default"
          color="primary"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [items.length, page, pages, hasSearchFilter]);

  // Modal state to open and close the modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="mx-auto px-5 mt-8"> {/* Container for the page */}
      <div className="flex"> {/* Flexbox layout */}
        <aside className="w-1/4 pr-5"> {/* Sidebar */}
          <div className="flex flex-col space-y-3">
            <h2 className="text-lg font-bold">Support for Open Source Software</h2>
            <p>A community with 83,853 members hunting for bounties and earning rewards</p>
            <Button color="primary" size="md" onPress={onOpen}>IMPORT A NEW ISSUE</Button>

            {/* Modal to post an issue */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" isDismissable={false} isKeyboardDismissDisabled={true}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">Import a new issue</ModalHeader>
                    <ModalBody>
                      {/* Modal form inputs */}
                      <Input placeholder="URL" fullWidth className="mt-4" onValueChange= {setURL}/>
                    </ModalBody>

                    {/* Centering the RadioGroup */}
                    <div className="flex flex-col p-6">
                      <RadioGroup label = "Select preference" className = "gap-4" onValueChange={setType}> {/* Added gap between radio buttons */}
                        <Radio value="better" description="Showcase your prefence for a better solution within alloted time.">Better Solution</Radio>
                        <Radio value="faster" description="Showcase your prefence for a faster solution.">Faster Solution</Radio>
                      </RadioGroup>
                    </div>

                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancel
                      </Button>
                      <Button color="primary" onPress={submitIssue}>
                        Submit
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>

            {/* Recent Activity Section */}
            <div>
              <h3 className="text-md font-bold my-2">Recent Activity</h3>
              <p>duc8996 started a solution on Unhandled Exception</p>
              <Divider className="my-3" />
              <p>jdgleaver submitted a claim for [Bounty $20]</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-3/4">
          <div className="flex flex-col gap-3">
            <Table 
              aria-label="Selection behavior table example with dynamic content"
              hideHeader
              isCompact
              topContent = {topContent}
              bottomContent = {bottomContent}
              bottomContentPlacement="outside"
              topContentPlacement="outside"
            >
              <TableHeader>
                <TableColumn>Issue</TableColumn>
              </TableHeader>
              <TableBody items={items}>
                {(item) => (
                  <TableRow key={item.title}>
                    {(columnKey) => 
                    <TableCell>
                      <Card className="max-w-[68vw]" href={"/issue/?issue=" + item.id} as={Link}>
                      <CardHeader className="flex gap-4 pt-4">
                        <Avatar src={item.avatar} name={item.creator} />
                        <div>
                          <h3 className="text-xl font-bold">{item.title}</h3>
                          <p className="text-gray-500">
                            posted by: {item.creator} | created: {item.created} | updated: {item.updated}
                          </p>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <p className="line-clamp-2">{item.description}</p>
                      </CardBody>
                      <CardFooter className="flex justify-between">
                        <span className="text-lg">{item.reward}$</span>
                      </CardFooter>
                    </Card>
                    </TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}
