import { Checkbox } from "antd";

export function TutorialStep({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative">
      <Checkbox
        className="absolute top-[3px] mr-2"
      />
      <label
        className="relative text-base text-foreground peer-checked:line-through font-medium"
      >
        <span className="ml-8">{title}</span>
        <div className="ml-8 text-sm peer-checked:line-through font-normal text-muted-foreground">
          {children}
        </div>
      </label>
    </li>
  );
}