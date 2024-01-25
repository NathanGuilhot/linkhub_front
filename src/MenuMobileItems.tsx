import { useState, ReactNode } from 'react';
import chevronIcon from './assets/chevron-up-solid.svg';


export function MenuMobileItems(props: { children?: ReactNode; subitems?: { text: string; }[]; href: string; isSubItem?: boolean; }) {
  const hasSubItems: boolean = props.subitems != undefined && props.subitems.length > 0;
  const [subItemsOpen, setSubItemsOpen] = useState<boolean>(false);

  return (
    <>
      <a className={"flex text-green-800 text-2xl pt-5 pb-5 cursor-pointer select-none " + (hasSubItems ? "" : "hover:bg-white") + (props.isSubItem ? " pl-5 font-bold" : " pl-1 font-extrabold")}
        onClick={() => { if (hasSubItems) setSubItemsOpen((v) => !v); else console.log("Access link : " + props.href); }}
      >
        <span className="ml-2">{props.children}</span>
        <span className="ml-auto mr-10">{hasSubItems ? <img src={chevronIcon} alt="arrow" className={"h-8 " + (subItemsOpen ? "rotate-180" : "")} /> : null}</span>
      </a>
      {subItemsOpen ?
        props.subitems?.map((i) => <MenuMobileItems key={i.text} href={i.text} isSubItem={true}>{i.text}</MenuMobileItems>)
        : null}
      {!props.isSubItem ? <hr className="bg-green-800" /> : null}
    </>
  );
}
