import { subtitle, title } from "@/components/primitives";
import {Divider} from "@nextui-org/divider";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import { MicrosoftIcon } from "@/components/icons";

export default function AboutPage() {
  return (
    <div className= "max-w">
      <div className="flex flex-col space-y-10">
      <div className="flex flex-col space-y-5">
        <div>
          <h2 className = "text-2xl">For Contributors and Freelancers</h2>
          <Divider className="my-3" />
        </div>
        <Card>
          <CardBody>
            <div className="flex gap-5">
              <MicrosoftIcon className="size-15"/>
              <div>
                <h1>Earn by Contributing to Open Source</h1>
                <p>Join the open-source movement and get rewarded with bounties for your contributions.</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-5">
              <MicrosoftIcon className="size-15"/>
              <div>
                <h1>Freelance on Demand with Seamless Workflows</h1>
                <p>Dive into on-demand projects as a freelancer, supported by our streamlined git workflow for efficient task delivery.</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-5">
              <MicrosoftIcon className="size-15"/>
              <div>
                <h1>Earn by Contributing to Open Source</h1>
                <p>Join the open-source movement and get rewarded with bounties for your contributions.</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col space-y-5">
        <div>
          <h2 className = "text-2xl">For Contributors and Freelancers</h2>
          <Divider className="my-3" />
        </div>
        <Card>
          <CardBody>
            <div className="flex gap-5">
              <MicrosoftIcon className="size-15"/>
              <div>
                <h1>Earn by Contributing to Open Source</h1>
                <p>Join the open-source movement and get rewarded with bounties for your contributions.</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-5">
              <MicrosoftIcon className="size-15"/>
              <div>
                <h1>Earn by Contributing to Open Source</h1>
                <p>Join the open-source movement and get rewarded with bounties for your contributions.</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-5">
              <MicrosoftIcon className="size-15"/>
              <div>
                <h1>Earn by Contributing to Open Source</h1>
                <p>Join the open-source movement and get rewarded with bounties for your contributions.</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
    </div>
  );
}
