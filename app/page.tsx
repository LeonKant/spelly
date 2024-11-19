import DefaultWrapper from "@/components/default-wrapper";
import Hero from "@/components/hero";
import { getUsers } from "@/db/queries/select";

export default async function Index() {

  await getUsers()
  
  return (
    <DefaultWrapper>
      <Hero />
    </DefaultWrapper>
  );
}
