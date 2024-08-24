import { ReactElementType } from 'shared/ReactType';
import { Fiber } from './internalTypes';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { createFiberFromElement, FiberNode } from './fiber';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

function createChildReconciler(shouldTrackSideEffects: boolean) {
	function reconcileSingleElement(
		returnFiber: Fiber,
		currentFiber: Fiber | null,
		element: ReactElementType
	) {
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	}

	function reconcileSingleTextNode(
		returnFiber: Fiber,
		currentFiber: Fiber | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}

	function placeSingleChild(fiber: Fiber) {
		if (shouldTrackSideEffects && fiber.alternate === null) {
			fiber.flags |= Placement;
		}
		return fiber;
	}

	return function reconcileChildFibers(
		current: Fiber | null,
		returnFiber: Fiber,
		nextChildren: ReactElementType
	) {
		if (typeof nextChildren.$$typeof === 'object' && nextChildren !== null) {
			switch (nextChildren.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, current, nextChildren)
					);
				default:
					if (__DEV__) console.warn('未实现的reconcile类型', nextChildren);
					break;
			}
		}

		// TODO: 多节点类型

		if (typeof nextChildren === 'string' || typeof nextChildren === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, current, nextChildren)
			);
		}

		if (__DEV__) console.warn('未实现的reconcile类型', nextChildren);
		return null;
	};
}

// mount时插入大量的节点时, 不希望追踪副作用(性能优化策略)
export const reconcileChildFibers = createChildReconciler(true);
export const mountChildFibers = createChildReconciler(false);
