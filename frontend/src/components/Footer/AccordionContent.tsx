import { useRef, useEffect, useState } from "react"

interface AccordionProps {
  isOpen: boolean
  children: React.ReactNode
}

const AccordionContent = ({ isOpen, children }: AccordionProps) => {
  const ref = useRef<HTMLUListElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight)
    }
  }, [children])

  return (
    <ul
      ref={ref}
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'mt-2 max-h-[999px]' : 'max-h-0'
      } space-y-1 text-sm text-white md:max-h-full md:block`}
      style={{ marginTop: isOpen ? '0.5rem' : 0 }}
    >
      {children}
    </ul>
  )
}

export default AccordionContent
