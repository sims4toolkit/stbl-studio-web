import type Workspace from "../models/workspace";

interface Session {
  workspace?: Workspace;
}

const ActiveSession: Session = {};

export default ActiveSession;
