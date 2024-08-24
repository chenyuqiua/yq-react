import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode } from './fiber';
import { FiberRootNode } from './fiberRoot';
import { Fiber } from './internalTypes';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

export function scheduleUpdateOnFiber(fiber: Fiber) {
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: Fiber) {
	let node = fiber;
	let parent = fiber.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}

	return node.tag === HostRoot ? node.stateNode : null;
}

function renderRoot(root: FiberRootNode) {
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (error) {
			if (__DEV__) {
				console.error('workLoop error', error);
			}
			workInProgress = null;
		}
	} while (true);

	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;

	// TODO: commitRoot
	// commitRoot(root);
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(unitOfWork: FiberNode) {
	const next = beginWork(unitOfWork.alternate, unitOfWork);
	unitOfWork.memoizedProps = unitOfWork.pendingProps;

	if (next === null) {
		completeUnitOfWork(unitOfWork);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(unitOfWork: FiberNode) {
	let completedWork: FiberNode | null = unitOfWork;
	const returnFiber = completedWork.return;

	do {
		completeWork(completedWork.alternate, completedWork);

		const siblingFiber = completedWork.sibling;
		if (siblingFiber !== null) {
			workInProgress = siblingFiber;
			return;
		}

		completedWork = returnFiber;
		workInProgress = completedWork;
	} while (completedWork !== null);
}
