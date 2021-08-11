import { SectionStyled } from "./Section.styled";
import { SectionProps } from "./Section.interface";
import { Typography, SVG } from "../../../../src/components";
export const Section: React.FC<SectionProps> = ({
  heading ="",
  children,
  icon,
  ...props
}) => {
  return (
    <SectionStyled {...props}>
            <SVG name={icon}/>
      <Typography className="heading" bold variant="headline_m">
        {heading.toUpperCase()}
      </Typography>
      {children}
    </SectionStyled>
  );
};
