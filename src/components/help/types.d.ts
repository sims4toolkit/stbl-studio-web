type DisplayType = "swimLane" | "questionAnswer" | "generalHtml" | "hr";

interface HelpSwimLaneData {
  kind: "swimLane";
  title: string;
  description: string;
  link: string;
}

interface HelpGeneralHtmlData {
  kind: "generalHtml";
  content: string;
}

interface HelpQuestionAnswerData {
  kind: "questionAnswer";
  question: string;
  answer: string;
  containsHtml?: boolean;
}

interface HelpHrData {
  kind: "hr";
}

type HelpContentItem =
  HelpSwimLaneData
  | HelpGeneralHtmlData
  | HelpQuestionAnswerData
  | HelpHrData;

interface HelpRouteData {
  title: string;
  backButtonLink?: string;
  content: HelpContentItem[];
}
