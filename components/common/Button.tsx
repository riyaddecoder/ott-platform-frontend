import React from "react";

export default function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
  }
) {
  return (
    <button
      {...props}
      className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {props.children}
    </button>
  );
}
