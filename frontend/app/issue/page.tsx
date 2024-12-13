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
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import React from "react";
import Markdown from "react-markdown";

export default function IssuePage() {
  let [url, setURL] = React.useState("");
  let [amount, setAmount] = React.useState("");
  let [acomments, setAcomments] = React.useState("");
  let [Issue, setIssue] = React.useState<String | null>(); 

  const { error, isLoading, Razorpay } = useRazorpay();
  
  // Modal state to open and close the modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen : isAmountOpen, onOpen : onAmountOpen, onOpenChange : onAmountOpenChange } = useDisclosure();

  const params = useSearchParams();
 
  let [issueDesc, issueDescSet] = React.useState({
    'id' : '',
    'title' : '',
    'creator' : '',
    'description' : '',
    'reward' : '',
    'isBest' : '',
    'isOpen' : '',
    'created' : '',
    'updated' : '',
    'url' : '',
    'createdBy' : '',
    'avatar' : '',
    'type' : ''
  });

  console.log(params.get("issue"));

  const getIssue = async (issueid: any) => {

    console.log("Issue id: ", issueid);

    try {
      let res = await fetch("/api/v1/issue/" + issueid, {
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

  const solution = async () => {
    let issue = params.get("issue");
    console.log("Issue is" + issue);

    try {
      let res = await fetch("/api/v1/solution", {
        headers: {
          "Content-Type": "application/json"
        },
        method : "POST",
        body: JSON.stringify({
          'issueid' : issue,
          'url' : url,
          'acomments' : acomments
        })
      })

      console.log("Response is", res);

      if (res.ok) {
        let message = await res.json();
        console.log("Recieved message is ", message);
        return true;
      } else {
        let error = await res.json();
        console.log(error);
      }
      
    } catch (err) {
      console.log("Catch err:", err);
    }
  }

  const pay = async () => {
    let issue = params.get("issue");
    console.log("Issue is" + issue);
    try {

      let res = await fetch("/api/v1/create-order", {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },

        body : JSON.stringify({ "amt" : amount, "currency" : "INR", "reciept" : "reciept_1" })
      })

      const order = await res.json();
      console.log(order);

      const options : RazorpayOrderOptions = {
        key: "rzp_test_DfwfIsr5DjGtTm",
        amount: order.amount,
        currency: order.currency,
        name: "OBounty", // Add company details
        description: "Payment for your bounty", // Add order details
        order_id: order.id,
        // this is make function which will verify the payment
        // after making the payment 
        handler: async (response: any) => {
          try {
            await fetch("/api/v1/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            // Add onPaymentSuccessfull function here
            alert("Payment successful!");

            res = await fetch("/api/v1/pay", {
            headers: {
              "Content-Type": "application/json"
            },
            method : "POST",
            body: JSON.stringify({
              'issue' : issue,
              'amount' : order.amount,
            })
          })

          console.log("Response is", res);

          if (res.ok) {
            let message = await res.json();
            console.log("Recieved message is ", message);
            return true;
          } else {
            let error = await res.json();
            console.log(error);
          }

          } catch (err : any) {
            // Add onPaymentUnSuccessfull function here
            alert("Payment failed: " + err.message);
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzpay = new Razorpay(options);
      // this will open razorpay window for take the payment in the frontend
      // under the hood it use inbuild javascript windows api 
      rzpay.open();

      rzpay.on("payment.failed", cb => {
          alert("Payment failed!");
      })
      
    } catch (err) {
      console.log("Catch err:", err);
    }
  }

  React.useEffect(() => {
    let issue = params.get("issue");
    console.log("Within useEffect: ", issue);
    getIssue(issue).then(
      x => {
        console.log(x);
        let now = Date.now()

        x.created = intlFormatDistance(Date.parse(x.created), now)
        x.updated = intlFormatDistance(Date.parse(x.updated), now)

        issueDescSet(prev => x);
      }
    )
  }, [Issue]);

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
                <Button color="primary" onPress={() => {
                  solution().then(x => onClose())}}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isAmountOpen} onOpenChange={onAmountOpenChange} size="2xl" isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Bounty</ModalHeader>
              <ModalBody>
                {/* Modal form inputs */}
                <Input type="number" placeholder="Amount" label="Enter Amount" isRequired={true} labelPlacement="outside" fullWidth className="mt-4" onValueChange= {setAmount}/>
                <Button color="primary" className="mt-2" onClick={() => {
                    pay().then( x => {
                      onClose()
                      setIssue("");
                    })
                  }
                }>
                  Pay with RazorPay
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
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
                <h2 className="text-2xl font-bold">{issueDesc.title}</h2>
                <p className="text-sm text-gray-500">Created {issueDesc.created}, imported by {issueDesc.creator}</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex max-h-[55vh]">
              <Markdown children={issueDesc.description} className="overflow-y-auto markdown"/>
            </CardBody>
          </Card>
        </div>
        <div className="w-1/3 p-5 rounded-md shadow-lg">
          <div className="text-center">
            <p className="text-lg">Total Bounty</p>
            <h3 className="text-4xl font-bold">${issueDesc.reward}</h3>
          </div>
          <Divider className="my-3" />
          <div className="text-center">
            <p>Status</p>
            <Badge color="success" size="lg">
              {issueDesc.isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
          <Divider className="my-3" />
          <div className="text-center">
            <p>Type</p>
            <Badge color="success" variant="flat" size="lg">
              {issueDesc.type}
            </Badge>
          </div>
          <Divider className="my-3" />
          <div className="flex flex-col gap-2 align-items items-center content-center">
            <p>Issue created by</p>
            <div className="flex items-center gap-2">
              <Avatar src={issueDesc.avatar} />
              <div className="text-sm">{issueDesc.createdBy}</div>
            </div>
          </div>
          <Divider className="my-3" />
          <div className="mt-5 flex flex-col gap-4">
            <Button
              href={issueDesc.url}
              as={Link}
              color="primary"
              showAnchorIcon
              variant="solid"
              fullWidth
            >
              Open Issue on Github
            </Button>
            <Button fullWidth color="primary" onClick={onOpen}>
              Solve Issue
            </Button>
            <Button fullWidth color="default" variant="light" onClick={onAmountOpen}>
              Add Bounty
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

