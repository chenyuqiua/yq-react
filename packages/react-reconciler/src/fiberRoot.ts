import { Container } from 'fiberConfig';
import { Fiber } from './internalTypes';

export class FiberRootNode {
	containerInfo: Container;
	current: Fiber;
	finishedWork: Fiber | null;

	constructor(containerInfo: any, hostRootFiber: Fiber) {
		this.containerInfo = containerInfo;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}
