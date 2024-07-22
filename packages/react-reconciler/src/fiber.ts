import { Key, Props, Ref } from 'shared/ReactType';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';

export class FiberNode {
	tag: WorkTag;
	key: Key;
	type: any;
	stateNode: any;
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	ref: Ref;
	pendingProps: Props;
	memoizedProps: Props | null;
	flags: Flags;
	alternate: FiberNode | null;

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

		// Effects
		this.flags = NoFlags;

		// 控制Fiber双缓冲
		this.alternate = null;
	}
}
