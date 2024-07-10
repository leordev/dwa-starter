import workplaceImage from "../assets/workplace.svg";

import { Web5Connection } from "@/web5/Web5Connection";
import { useWeb5 } from "@/web5/Web5Provider";
import { Typography } from "@/components/ui/typography";
import { VerifiableCredential } from "@web5/credentials";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDownIcon } from "lucide-react";

export const Home = () => {
  const { did, web5Connection, bearerDid } = useWeb5();

  const handleCreateVCClick = async () => {
    if (!bearerDid || !did || !web5Connection) {
      return;
    }

    const vc = await VerifiableCredential.create({
      type: "Web5QuickstartCompletionCredential",
      issuer: did,
      subject: did,
      data: {
        name: "Alice Smith",
        completionDate: new Date().toISOString(),
        expertiseLevel: "Beginner",
      },
    });
    console.info({ vc });

    const signedVc = await vc.sign({ did: bearerDid });
    console.info({ signedVc });

    const { record } = await web5Connection.web5.dwn.records.create({
      data: signedVc,
      message: {
        schema: "Web5QuickstartCompletionCredential",
        dataFormat: "application/vc+jwt",
        published: true,
      },
    });
    console.info({ record });
  };

  return (
    <div className="w-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold">DWA Starter</h1>
        <div className="flex justify-center my-4">
          <img src={workplaceImage} className="max-h-96 mx-auto" alt="DWA" />
        </div>
        <div className="my-4">
          <Web5Connection />
        </div>
      </div>

      {did && web5Connection && (
        <div className="space-y-8">
          <Collapsible>
            <div className="flex items-center justify-between space-x-4 px-4">
              <Typography variant="h2">Web5 Bearer DID Document</Typography>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDownIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <pre>
                <Typography variant="code">
                  {JSON.stringify(bearerDid?.document, null, 2)}
                </Typography>
              </pre>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <div className="flex items-center justify-between space-x-4 px-4">
              <Typography variant="h2">Verifiable Credentials</Typography>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDownIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <Button onClick={handleCreateVCClick}>
                Create Verifiable Credential
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
};
