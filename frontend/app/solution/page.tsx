"use client"; 

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import { Badge } from "@nextui-org/badge";
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import { useSearchParams } from "next/navigation";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/modal";
import { Input, Textarea } from "@nextui-org/input";
import { intlFormatDistance } from "date-fns";
import { PressEvent } from "@react-types/shared";
import React from "react";
import Markdown from "react-markdown";

export default function SolutionPage() {
  let [url, setURL] = React.useState("");
  let [amount, setAmount] = React.useState("");
  let [acomments, setAcomments] = React.useState("");
  let [Issue, setIssue] = React.useState<String | null>(); 

  // Modal state to open and close the modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen : isAmountOpen, onOpen : onAmountOpen, onOpenChange : onAmountOpenChange } = useDisclosure();

  const params = useSearchParams();
 
  let [soltuionDesc, solDescSet] = React.useState({
    'url' : '',
    'issue_url' : '',
    'comments' : '',
    'votes' : 0,
    'threshold' : 0,
    'name' : '',
    'avatar' : '',
    'created' : ''
  });

  console.log(params.get("sol"));

  const getSolution = async (solutionid: any) => {

    console.log("Issue id: ", solutionid);

    try {
      let res = await fetch("/api/v1/solution/" + solutionid, {
        headers: {
          "Content-Type": "application/json"
        },
      })

      console.log("Response is", res);

      if (res.ok) {
        let message = await res.json();
        console.log("Recieved message is ", message);
        return message["message"];
      } else {
        let error = await res.json();
        console.log(error);
      }
      
    } catch (err) {
      console.log("Catch err:", err);
    }
  }

  React.useEffect(() => {
    let sol = params.get("sol");
    console.log("Within useEffect: ", sol);
    getSolution(sol).then(
      x => {
        console.log(x);
        let now = Date.now()
        x.created = intlFormatDistance(Date.parse(x.created), now)
        solDescSet(prev => x);
      }
    )
  }, []);

  return (
    <div className="mx-auto mt-4 px-5">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Solve Issue</ModalHeader>
              <ModalBody>
                {/* Modal form inputs */}
                <Input placeholder="https://github.com/..." label="Enter Github PR URL" isRequired={true} labelPlacement="outside" fullWidth className="mt-4" onValueChange= {setURL}/>
                <Textarea 
                  label="Enter any further comments" 
                  fullWidth
                  placeholder="You can enter information about any further PR(s) or things you would like backers to consider..."
                  minRows={5} 
                  labelPlacement="outside"
                  onValueChange={setAcomments}
                >
                  </Textarea>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary">
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="flex justify-between">
        <div className="w-2/3 p-5 rounded-md shadow-lg">
          <Card>
            <CardHeader>
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold">Solution</h2>
                <p className="text-sm text-gray-500 mt-1">Started {soltuionDesc.created}, by {soltuionDesc.name}</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex h-[60vh]">
              <Markdown children={soltuionDesc.comments} className="overflow-y-auto markdown"/>
            </CardBody>
          </Card>
        </div>
        <div className="w-1/3 p-5 rounded-md shadow-lg">
          <div className="text-center">
            <p className="text-lg">Total Votes</p>
            <h3 className="text-4xl font-bold">{soltuionDesc.votes} / {soltuionDesc.threshold}</h3>
          </div>
          <Divider className="my-3" />
          <div className="text-center">
            <p>Status</p>
            <Badge color="success" size="lg">
              {soltuionDesc.votes >= soltuionDesc.threshold ? "Accepted" : "Ongoing" }
            </Badge>
          </div>
          <Divider className="my-3" />
          <div className="flex flex-col gap-2 align-items items-center content-center">
            <p>Solution started by</p>
            <div className="flex items-center gap-2">
              <Avatar src={soltuionDesc.avatar} />
              <div className="text-sm">{soltuionDesc.created}</div>
            </div>
          </div>
          <Divider className="my-3" />
          <div className="mt-5 flex flex-col gap-4">
            <Button
              href={soltuionDesc.url}
              as={Link}
              color="primary"
              variant="solid"
              fullWidth
              showAnchorIcon={true}
            >
              Open issue page on Github
            </Button>
            <Button fullWidth color="success" onClick={onOpen}>
              Accept Solution
            </Button>
            <Button fullWidth color="danger" onClick={onAmountOpen}>
              Reject Solution
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

