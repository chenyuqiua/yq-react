import {
	appendInitialChild,
	createInstance,
	createTextInstance
} from 'fiberConfig';
import { Fiber } from './internalTypes';
import { HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

export function completeWork(current: Fiber | null, workInProgress: Fiber) {
	const newProps = workInProgress.pendingProps;

	switch (workInProgress.tag) {
		case HostRoot:
			bubbleProperties(workInProgress);
			return null;
		case HostComponent:
			if (current !== null && workInProgress.stateNode) {
				// update
			} else {
				// mount
				const instance = createInstance(workInProgress.type, newProps);
				appendAllChildren(instance, workInProgress);
				workInProgress.stateNode = instance;
			}
			bubbleProperties(workInProgress);
			return null;
		case HostText:
			if (current !== null && workInProgress.stateNode) {
				// update
			} else {
				// mount
				const instance = createTextInstance(newProps.content);
				workInProgress.stateNode = instance;
			}
			bubbleProperties(workInProgress);
			return null;
		default:
			if (__DEV__) console.warn(`${workInProgress.tag}类型completeWork未实现`);
	}
	return null;
}

function appendAllChildren(parent: Fiber, workInProgress: Fiber) {
	let node = workInProgress.child;

	while (node !== null) {
		if (node?.tag === HostComponent || node?.tag === HostText) {
			appendInitialChild(parent, node.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}

		if (node === workInProgress) {
			return;
		}

		while (node.sibling === null) {
			if (node.return === null || node.return === workInProgress) {
				return;
			}
			node = node.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

function bubbleProperties(workInProgress: Fiber) {
	let subtreeFlags = NoFlags;
	let child = workInProgress.child;

	while (child !== null) {
		subtreeFlags |= child.flags;
		subtreeFlags |= child.subtreeFlags;

		child.return = workInProgress;
		child = child.sibling;
	}

	workInProgress.subtreeFlags |= subtreeFlags;
}
