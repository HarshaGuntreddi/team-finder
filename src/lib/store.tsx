import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Employee, NewEmployee } from '../types'
import { sampleEmployees } from '../data/sampleData'
import { parseSkills } from './skills'

const STORAGE_KEY = 'team-finder:employees:v1'
const THEME_KEY = 'team-finder:theme'

type Theme = 'light' | 'dark'

interface StoreValue {
  employees: Employee[]
  addEmployee: (data: NewEmployee) => Employee
  updateEmployee: (id: string, data: NewEmployee) => void
  deleteEmployee: (id: string) => void
  /** Replace the whole dataset (used by import). Returns the new count. */
  replaceAll: (employees: Employee[]) => void
  /** Merge in employees (used by import "append"). */
  mergeIn: (employees: Employee[]) => void
  resetToSample: () => void
  theme: Theme
  toggleTheme: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

function genId(): string {
  return 'emp-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

function loadEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return sampleEmployees
    const parsed = JSON.parse(raw) as Employee[]
    if (!Array.isArray(parsed)) return sampleEmployees
    // Ensure skills exist (in case of older data).
    return parsed.map((e) => ({
      ...e,
      skills: e.skills && e.skills.length ? e.skills : parseSkills(e.expertiseRaw || ''),
    }))
  } catch {
    return sampleEmployees
  }
}

function loadTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(loadEmployees)
  const [theme, setTheme] = useState<Theme>(loadTheme)

  // Persist employees.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
    } catch {
      /* ignore quota errors */
    }
  }, [employees])

  // Apply + persist theme.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const addEmployee = useCallback((data: NewEmployee) => {
    const emp: Employee = {
      ...data,
      id: genId(),
      skills: data.skills && data.skills.length ? data.skills : parseSkills(data.expertiseRaw || ''),
    }
    setEmployees((prev) => [emp, ...prev])
    return emp
  }, [])

  const updateEmployee = useCallback((id: string, data: NewEmployee) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              ...data,
              id,
              skills:
                data.skills && data.skills.length
                  ? data.skills
                  : parseSkills(data.expertiseRaw || ''),
            }
          : e,
      ),
    )
  }, [])

  const deleteEmployee = useCallback((id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const replaceAll = useCallback((next: Employee[]) => {
    setEmployees(next)
  }, [])

  const mergeIn = useCallback((incoming: Employee[]) => {
    setEmployees((prev) => {
      const byEmpId = new Map(prev.map((e) => [e.employeeId || e.id, e]))
      for (const emp of incoming) {
        byEmpId.set(emp.employeeId || emp.id, emp)
      }
      return [...byEmpId.values()]
    })
  }, [])

  const resetToSample = useCallback(() => setEmployees(sampleEmployees), [])

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    [],
  )

  const value = useMemo<StoreValue>(
    () => ({
      employees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      replaceAll,
      mergeIn,
      resetToSample,
      theme,
      toggleTheme,
    }),
    [employees, addEmployee, updateEmployee, deleteEmployee, replaceAll, mergeIn, resetToSample, theme, toggleTheme],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within a StoreProvider')
  return ctx
}
