import { Container } from 'fiberConfig';
import { FiberNode } from './fiber';
import { HostRoot } from './workTags';
import { FiberRootNode } from './fiberRoot';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './classUpdateQueue';
import { ReactElementType } from 'shared/ReactType';
import { scheduleUpdateOnFiber } from './workLoop';

// 创建RootFiberNode
export function createContainer(containerInfo: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	const root = new FiberRootNode(containerInfo, hostRootFiber);

	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}

export function updateContainer(
	element: ReactElementType | null,
	container: FiberRootNode
) {
	const hostRootFiber = container.current;
	const update = createUpdate<ReactElementType | null>(element);
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);

	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
