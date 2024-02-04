import { TopNavBar } from "./TopNavBar";
import { MenuMobileItems } from "./MenuMobileItems";

export function MenuMobile(props: { close: () => void }) {
  return (
    <div className="bg-green-400 w-full min-h-screen absolute">
      <TopNavBar action={props.close} inMenu={true} />
      <div className="flex flex-col p-5 mt-8">
        <MenuMobileItems href="">Templates</MenuMobileItems>
        <MenuMobileItems href="">Marketplace</MenuMobileItems>
        <MenuMobileItems
          href=""
          subitems={[
            { text: "Linktree for Instagram" },
            { text: "Linktree for TikTok" },
            { text: "Linktree for Twitter" },
            { text: "Linktree for LinkedIn" },
          ]}
        >
          Discover
        </MenuMobileItems>
        <MenuMobileItems href="">Pricing</MenuMobileItems>
        <MenuMobileItems
          href=""
          subitems={[
            { text: "The 2023 Creator Report" },
            { text: "All Articles" },
            { text: "Creators" },
            { text: "Trends" },
            { text: "Best Practices" },
            { text: "Company" },
            { text: "Product News" },
            { text: "Help" },
          ]}
        >
          Learn
        </MenuMobileItems>
      </div>
    </div>
  );
}
