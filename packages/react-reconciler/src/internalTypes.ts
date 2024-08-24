import { Key, Props, Ref } from 'shared/ReactType';
import { WorkTag } from './workTags';
import { Flags } from './fiberFlags';

export type Fiber = {
	// 实例属性
	tag: WorkTag;
	key: Key;
	type: any;
	stateNode: any;

	// FiberNode结构关系
	return: Fiber | null;
	sibling: Fiber | null;
	child: Fiber | null;
	index: number;

	ref: Ref;

	// 工作单元属性
	pendingProps: Props;
	memoizedProps: Props | null;
	updateQueue: unknown;
	memoizedState: any;

	// Effects
	flags: Flags;
	subtreeFlags: Flags;

	// 控制Fiber双缓冲
	alternate: Fiber | null;
};
