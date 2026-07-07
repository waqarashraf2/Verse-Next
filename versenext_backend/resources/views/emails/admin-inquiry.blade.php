<h2>New Project Inquiry</h2>

<p><strong>Name:</strong> {{ $inquiry->full_name }}</p>
<p><strong>Email:</strong> {{ $inquiry->email }}</p>
<p><strong>Phone:</strong> {{ $inquiry->phone }}</p>
<p><strong>Company:</strong> {{ $inquiry->company_name }}</p>
<p><strong>Service:</strong> {{ $inquiry->service_needed }}</p>
<p><strong>Budget:</strong> {{ $inquiry->project_budget }}</p>

<p><strong>Details:</strong></p>
<p>{{ $inquiry->project_details }}</p>
