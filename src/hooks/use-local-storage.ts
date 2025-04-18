"use client";

import { useState, useEffect } from "react";

function useLocalStorage<T>(
	key: string,
	initialValue?: T | undefined,
): [T | undefined, (value: T) => void] {
	const [storedValue, setStoredValue] = useState<T | undefined>(initialValue);

	useEffect(() => {
		try {
			const item = window.localStorage.getItem(key);
			if (item) {
				setStoredValue(JSON.parse(item));
			}
		} catch (error) {
			console.log(error);
		}
	}, [key]);

	const setValue = (value: T) => {
		try {
			setStoredValue(value);
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.log(error);
		}
	};

	return [storedValue, setValue];
}

export default useLocalStorage;
