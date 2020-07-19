import { Protocols } from "../types/protocol.enum";
import { PathLike } from "fs";

export const address = (protocol: Protocols, host: PathLike, port: number) =>
	`${protocol}${host}:${port}`;