import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSettingsForm } from "../forms/AccountSettingsForm";
import { deleteAccountAction } from "@/actions/form";
import { displayErrorToast } from "@/utils/client";

interface Props {
  username: string;
}

export function SettingsTabs({ username }: Props) {
  const deleteAccount = async () => {
    const { error, message } = await deleteAccountAction();
    if (error) {
      displayErrorToast(message);
    }
  };
  return (
    <Tabs defaultValue="account">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="flex flex-col gap-4">
        <AccountSettingsForm username={username} />
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Delete account</CardTitle>
            <CardDescription>
              This action is permanent and all data will be deleted. Please be
              certain.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant={"destructive"} onClick={deleteAccount}>
              Delete your account
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
