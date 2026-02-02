
import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { LucideCalendarRange } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Spinner } from './ui/spinner'
import { Textarea } from './ui/textarea'
import type {TransactionForm} from '@/schema';
import { createTransactionFn, updateTransactionFn } from '@/server/transaction'
import {  transactionFormSchema } from '@/schema'

const TransactionForm = ({
  categories,
  defaultValues,
  transactionId,
}: {
  categories: Array<{ id: string; name: string; type: string }>
  transactionId?: string
  defaultValues?: {
    amount: number
    categoryId: string
    description: string
    transactionDate: Date
    transactionType: string
  }
}) => {
  const [isPending, startTransaction] = useTransition()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      amount: 0,
      categoryId: '',
      description: '',
      transactionDate: new Date(),
      transactionType: 'income',
      ...defaultValues,
    },
    validators: { onSubmit: transactionFormSchema },
    onSubmit: ({ value }) => {
      startTransaction(async () => {
        try {
          if (transactionId) {
            await updateTransactionFn({
              data: {
                id: transactionId,
                amount: value.amount,
                description: value.description,
                categoryId: value.categoryId,
                transactionDate: value.transactionDate,
                transactionType: value.transactionType,
              },
            })
            form.reset()
            toast.success('Transaction Updated successfully')
            navigate({
              to: '/dashboard/transactions',
            })
          } else {
            await createTransactionFn({ data: value })
            form.reset()
            toast.success('Transaction created successfully')
            navigate({
              to: '/dashboard/transactions',
              search: {
                month: value.transactionDate.getMonth() + 1,
                year: value.transactionDate.getFullYear(),
              },
            })
          }
        } catch (error) {
          toast.error('Failed to create transaction', {
            description: error instanceof Error ? error.message : String(error),
          })
        }
      })
    },
  })

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Transaction Type */}
            <form.Field
              name="transactionType"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Transaction Type
                    </FieldLabel>

                    <Select
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value)
                        field.handleBlur()

                        const firstCategory = categories.find(
                          (category) => category.type === value,
                        )
                        if (firstCategory) {
                          form.setFieldValue('categoryId', firstCategory.id)
                        }
                      }}
                      aria-invalid={isInvalid}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Select Transaction Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Transaction Type</SelectLabel>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            {/* CategoryId */}
            <form.Field
              name="categoryId"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                const currentType = form.getFieldValue('transactionType')
                const filteredCategories = categories.filter(
                  (category) => category.type === currentType,
                )

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>

                    <Select
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value)
                        field.handleBlur()
                      }}
                      aria-invalid={isInvalid}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Category</SelectLabel>
                          {filteredCategories.map((category) => (
                            <SelectItem value={category.id} key={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            {/* Transaction Date */}
            <form.Field
              name="transactionDate"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Transaction Date
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id={field.name}
                          className="justify-start font-normal"
                        >
                          <LucideCalendarRange />
                          {field.state.value ? (
                            <span>{format(field.state.value, 'PPP')}</span>
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.state.value}
                          onSelect={(value) => {
                            if (value) {
                              field.handleChange(value)
                              field.handleBlur()
                            }
                          }}
                          defaultMonth={field.state.value}
                          disabled={{ after: new Date() }}
                        />
                      </PopoverContent>
                    </Popover>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            {/* Amount */}
            <form.Field
              name="amount"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      placeholder=""
                      min={0}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(+e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            {/* Description */}
            <div className="col-span-1 md:col-span-2">
              <form.Field
                name="description"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        placeholder=""
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />} Submit
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}

export default TransactionForm
