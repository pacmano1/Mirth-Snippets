-- not correct, do not use.

with started as (select message_id, received_date from d_mm1 where connector_name = 'Source' and status = 'T'),
     max_send_date as (select message_id, max(response_date) as final_send_date
                       from d_mm1
                       where status = 'S'
                         and connector_name != 'Source'
                       group by message_id),
     per_message_start_end as (select s.message_id,
                                      s.received_date,
                                      msd.final_send_date,
                                      (extract('epoch' from msd.final_send_date) -
                                       extract('epoch' from s.received_date)) * 1000 as ms

                               from started s
                                        join max_send_date msd on msd.message_id = s.message_id)
select pmse.message_id, d_mcm1."LOCATION", pmse.final_send_date, ms
from per_message_start_end pmse
         join d_mcm1 on d_mcm1.message_id = pmse.message_id
where date_trunc('day', received_date) = date_trunc('day', final_send_date)
  and date_trunc('day', final_send_date) = '2022-09-04'
order by ms desc
limit 10
