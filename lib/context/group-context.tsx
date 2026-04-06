"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type GroupContextType = {
  hasGroup: boolean
  groupId: number | null
  groupName: string | null
  isAdmin: boolean
  updateGroup: (data: { id: number; nome: string; isAdmin: boolean }) => void
  clearGroup: () => void
}

const GroupContext = createContext<GroupContextType | undefined>(undefined)

export function GroupProvider({ children }: { children: ReactNode }) {
  const [hasGroup, setHasGroup] = useState(false)
  const [groupId, setGroupId] = useState<number | null>(null)
  const [groupName, setGroupName] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("groupData")
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setHasGroup(data.hasGroup || false)
        setGroupId(data.groupId || null)
        setGroupName(data.groupName || null)
        setIsAdmin(data.isAdmin || false)
      } catch (error) {
        console.error("Erro ao carregar dados do grupo:", error)
      }
    }
  }, [])

  function updateGroup(data: { id: number; nome: string; isAdmin: boolean }) {
    setHasGroup(true)
    setGroupId(data.id)
    setGroupName(data.nome)
    setIsAdmin(data.isAdmin)
    localStorage.setItem(
      "groupData",
      JSON.stringify({
        hasGroup: true,
        groupId: data.id,
        groupName: data.nome,
        isAdmin: data.isAdmin,
      })
    )
  }

  function clearGroup() {
    setHasGroup(false)
    setGroupId(null)
    setGroupName(null)
    setIsAdmin(false)
    localStorage.removeItem("groupData")
  }

  return (
    <GroupContext.Provider
      value={{
        hasGroup,
        groupId,
        groupName,
        isAdmin,
        updateGroup,
        clearGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  )
}

export function useGroupContext() {
  const context = useContext(GroupContext)
  if (context === undefined) {
    throw new Error("useGroupContext deve ser usado dentro de GroupProvider")
  }
  return context
}
