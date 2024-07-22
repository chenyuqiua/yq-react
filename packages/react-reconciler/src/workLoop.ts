import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

let workInProgress: FiberNode | null = null;
function prepareFreshStack(root: FiberNode) {
	workInProgress = root;
}

function renderRoot(root: FiberNode) {
	prepareFreshStack(root);

	do {
		try {
			workLoop();
		} catch (error) {
			console.error('workLoop error', error);
			workInProgress = null;
		}
	} while (true);
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(unitOfWork: FiberNode) {
	const next = beginWork(unitOfWork);
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
		completeWork(completedWork);

		const siblingFiber = completedWork.sibling;
		if (siblingFiber !== null) {
			workInProgress = siblingFiber;
			return;
		}

		completedWork = returnFiber;
		workInProgress = completedWork;
	} while (completedWork !== null);
}
