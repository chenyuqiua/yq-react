import { processUpdateQueue, UpdateQueue } from './classUpdateQueue';
import { Fiber } from './internalTypes';
import { HostComponent, HostRoot, HostText } from './workTags';
import { reconcileChildFibers, mountChildFibers } from './childFiber';
import { ReactElementType } from 'shared/ReactType';

export function beginWork(
	current: Fiber | null,
	workInProgress: Fiber
): Fiber | null {
	switch (workInProgress.tag) {
		case HostRoot:
			return updateHostRoot(current, workInProgress);
		case HostComponent:
			return updateHostComponent(current, workInProgress);
		case HostText:
			return updateHostText();
		default:
			if (__DEV__) console.warn('该类型beginWork未实现');
	}

	return null;
}

function updateHostRoot(current: Fiber | null, workInProgress: Fiber) {
	const prevState = workInProgress.memoizedState;
	const updateQueue = workInProgress.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	const { memoizedState } = processUpdateQueue(prevState, pending);
	workInProgress.memoizedState = memoizedState;

	const nextChildren = workInProgress.memoizedState;
	reconcileChildren(current, workInProgress, nextChildren);
	return workInProgress.child;
}

function updateHostComponent(current: Fiber | null, workInProgress: Fiber) {
	const nextProps = workInProgress.pendingProps;
	const nextChildren = nextProps.children;

	reconcileChildren(current, workInProgress, nextChildren);
	return workInProgress.child;
}

function updateHostText() {
	return null;
}

function reconcileChildren(
	current: Fiber | null,
	workInProgress: Fiber,
	nextChildren: ReactElementType
) {
	if (current === null) {
		workInProgress.child = mountChildFibers(
			current,
			workInProgress,
			nextChildren
		);
	} else {
		workInProgress.child = reconcileChildFibers(
			current,
			workInProgress,
			nextChildren
		);
	}
}
