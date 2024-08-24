import { Key, Props, ReactElementType, Ref } from 'shared/ReactType';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Fiber } from './internalTypes';

export class FiberNode {
	tag: WorkTag;
	key: Key;
	type: any;
	stateNode: any;

	return: Fiber | null;
	sibling: Fiber | null;
	child: Fiber | null;
	index: number;
	ref: Ref;
	pendingProps: Props;
	memoizedProps: Props | null;
	memoizedState: any;
	updateQueue: unknown;
	flags: Flags;
	subtreeFlags: Flags;
	alternate: Fiber | null;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例属性
		this.tag = tag;
		this.key = key;
		this.type = null;
		this.stateNode = null;

		// FiberNode结构关系
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.ref = null;

		// 工作单元属性
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.memoizedState = null;
		this.updateQueue = null;

		// Effects
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;

		this.alternate = null;
	}
}

export function createWorkInProgress(
	current: Fiber,
	pendingProps: Props
): Fiber {
	let wip = current.alternate;

	if (wip === null) {
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;

		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
		wip.subtreeFlags = NoFlags;
	}

	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;

	return wip;
}

export function createFiberFromElement(element: ReactElementType): Fiber {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;

	if (typeof type === 'string') {
		fiberTag = HostComponent;
	} else if (typeof type === 'function' && __DEV__) {
		console.warn('未定义的Type类型', element);
	}

	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
