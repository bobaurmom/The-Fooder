/**
 * PhoneFrame
 * ----------
 * Makes the app feel like a phone screen on every device:
 * - On small screens (actual phones) it just fills the viewport.
 * - On tablets/desktop it centers a fixed-width "phone" card so you can
 *   preview the mobile design without shrinking your browser.
 */
export default function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen w-full bg-neutral-200 flex items-center justify-center sm:py-8">
      <div
        className="
          relative w-full h-screen sm:h-[795px]
          sm:max-w-[430px]
          bg-[#F5F5F5]
          sm:rounded-[2.5rem] sm:shadow-2xl
          overflow-hidden
          flex flex-col
        "
      >
        {children}
      </div>
    </div>
  )
}
