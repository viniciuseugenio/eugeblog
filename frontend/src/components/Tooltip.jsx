/**
 * A tooltip component that displays a text message when the parent element is hovered.
 *
 * @component
 * @param {string} props.text - The text content of the tooltip.
 * @param {string} props.topPosition - Additional Tailwind CSS classes to control the tooltip's vertical positioning.
 * @returns {JSX.Element} The rendered tooltip component.
 *
 * @example
 * // Ensure the tooltip is inside a parent element with `relative` positioning and the `group` class.
 * <div className="relative group">
 *   <button className="px-4 py-2 bg-blue-500 text-white">Hover me</button>
 *   <Tooltip text="This is a tooltip" topPosition="top-0" />
 * </div>
 *
 * @note This component must be a child of an element that:
 * - Has `relative` positioning to ensure proper placement.
 * - Contains the Tailwind CSS `group` class to enable hover-based visibility.
 */
export default function Tooltip({ text, topPosition }) {
  return (
    <span
      className={`${topPosition} absolute left-1/2 z-20 origin-bottom -translate-x-1/2 scale-0 whitespace-nowrap rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-bold opacity-0 shadow-md transition-all duration-200 ease-in-out group-hover:scale-100 group-hover:opacity-100 group-hover:delay-500 group-[.open]:scale-0`}
    >
      {text}
    </span>
  );
}
