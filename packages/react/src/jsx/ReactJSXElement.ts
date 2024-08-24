import hasOwnProperty from 'shared/hasOwnProperty';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import {
	ReactElementType,
	Type,
	Key,
	Ref,
	Props,
	ElementType
} from 'shared/ReactType';

function ReactElement(
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'chen_yq'
	};

	return element;
}

function hasValidRef(config: any)  {
  return config.ref !== undefined
}
function hasValidKey(config: any)  {
  return config.key !== undefined
}

export function createElement(
	type: ElementType,
	config: any,
	...maybeChildren: any
) {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};

	// handle config params
	for (const propName in config) {
		const val = config[propName];

		if (propName === 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		}

		if (propName === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}

		if (hasOwnProperty.call(config, propName)) {
			props[propName] = val;
		}
	}
	// handle maybeChildren
	const maybeChildrenLength = maybeChildren.length;
	if (maybeChildrenLength) {
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0];
		} else {
			props.children = maybeChildren;
		}
	}

	return ReactElement(type, key, ref, props);
}


export function jsx(type: ElementType, config: any, maybeKey: Key) {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};

  	// handle key
	if (maybeKey !== undefined) {
		key = '' + maybeKey;
	}

  if(hasValidKey(config)) {
    key = '' + config.Key
  }
  if(hasValidRef(config)) {
    ref = config.ref
  }

	// handle config params
	for (const propName in config) {
		const val = config[propName];

		if (hasOwnProperty.call(config, propName) && propName !== 'key' && propName !== 'ref') {
			props[propName] = val;
		}
	}

	return ReactElement(type, key, ref, props);
}

export const jsxDEV = jsx;
